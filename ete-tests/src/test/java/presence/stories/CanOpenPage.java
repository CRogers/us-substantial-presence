package presence.stories;

import com.palantir.docker.compose.DockerComposeRule;
import com.palantir.docker.compose.configuration.ShutdownStrategy;
import com.palantir.docker.compose.connection.waiting.HealthChecks;
import net.serenitybdd.junit.runners.SerenityRunner;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;
import net.serenitybdd.screenplay.questions.Text;
import net.serenitybdd.screenplay.targets.Target;
import net.thucydides.core.annotations.Managed;
import net.thucydides.core.annotations.Steps;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.WebDriver;
import presence.steps.OpenPage;

import static net.serenitybdd.screenplay.EventualConsequence.eventually;
import static net.serenitybdd.screenplay.GivenWhenThen.givenThat;
import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.GivenWhenThen.then;
import static org.hamcrest.Matchers.is;

@RunWith(SerenityRunner.class)
public class CanOpenPage {
    private final Actor callum = Actor.named("callum");

    @Rule
    public DockerComposeRule composition = DockerComposeRule.builder()
        .file("docker-compose.yml")
        .waitingForService("selenium", HealthChecks.toRespondOverHttp(4444,
            port -> port.inFormat("http://$HOST:$EXTERNAL_PORT/wd/hub")))
        .shutdownStrategy(ShutdownStrategy.AGGRESSIVE)
        .build();

    @Managed(uniqueSession = true)
    public WebDriver callumsBrowser;

    @Before
    public void callumCanBrowseTheWeb() {
        callum.can(BrowseTheWeb.with(callumsBrowser));
    }

    @Steps private OpenPage openPage;

    @Test
    public void canOpenPage() {
        givenThat(callum).wasAbleTo(openPage);

        Question<String> itIsChristmas = actor -> Text.of(Target
            .the("Is it Xmas?")
            .locatedBy("/html/body"))
            .viewedBy(actor)
            .asString();
        then(callum).should(eventually(seeThat(
            itIsChristmas, is("Hi")
        )));
    }

    @Test
    public void enter_travel_history_into_textbox_and_see_that_they_do_not_have_substantial_presence() {

    }
}
